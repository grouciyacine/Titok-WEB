import User from '../../models/User.js'
import Videos from '../../models/Videos.js'
import verify from '../../verify.js'
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis'
import path from 'path'
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs'

export default {
    Query: {
        async GetVideosRandom(_, { }, context, info) {
            try {

                const videos = await Videos.find()
                const usersIds = videos?.map((vid) => vid.userId)
                const users = await User.find({ _id: { $in: usersIds } })
                const usersMap = {}
                users.forEach((user) => {
                    usersMap[user._id] = user
                })
                const videosWithUsers = videos?.map((vid) => ({
                    video: vid,
                    user: usersMap[vid?.userId] ? usersMap[vid?.userId] : null,
                }))
                return videosWithUsers
            } catch (err) {
                console.log(err)
            }
        },
        async GetMyVideos(_, { }, context, info) {
            try {
                const userId = verify(context)
                let id;
                await userId.then((value) => {
                    id = value
                })
                const myVideos = await Videos.find({ userId: id })
                return myVideos;
            } catch (err) {
                console.log(err)
            }
        },
        async GetLikedVideos(_, { }, context, info) {
            try {
                const UserID = verify(context)
                let id;
                await UserID.then((value) => {
                    id = value;
                })
                const likedVideo = await Videos.find({ likesID: id });
                return likedVideo
            } catch (err) {
                console.log(err)
            }
        },
        async getFile(_, { fileId }, context, info) {
            try {
                const authClient = await authorize();
                const drive = google.drive({ version: 'v3', auth: authClient });
                const response = await drive.files.get({
                    fileId: fileId,
                    fields: 'id, name, mimeType, parents' // You can specify which fields you want to retrieve
                });
                console.log('File metadata:', response.data);
                return "OK";
            } catch (error) {
                console.error('Error retrieving file:', error);
                throw new Error('Failed to retrieve the file');
            }
        }
    },
    Mutation: {
        async CreateVideo(_, { vid: { title, url, hashtags } }, context, info) {
            const userId = verify(context)
            console.log(userId)
            let id
            await userId.then((value) => {
                id = value;
            });
            const newVid = await Videos.create({ userId: id, url: url, title: title, hashtags: hashtags })
            newVid.save()
            return {
                userId: userId, title, url, hashtags, time: newVid.createdAt, id: newVid._id
            }
        },
        async  uploadVideo(_, { file }) {
            try {
                const { createReadStream, filename, mimetype } = await file;
                const uniqueFilename = `${uuidv4()}-${filename}`;
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                const tempDir = path.join(__dirname, 'public', 'videos');
                const tempFilePath = path.join(tempDir, `${uniqueFilename}`);
                const uploadPath = path.join(__dirname, 'public', 'videos', `${uniqueFilename}.m3u8`);
        
                // Save the uploaded video to tempFilePath
                await new Promise((resolve, reject) => {
                    createReadStream()
                        .pipe(fs.createWriteStream(tempFilePath))
                        .on('finish', resolve)
                        .on('error', reject);
                });
        
                // Spawn FFmpeg process to generate HLS playlist (.m3u8)
                const ffmpegProcess = spawn('ffmpeg', [
                    '-i', tempFilePath,      // Input file path
                    '-c:a', 'copy',          // Copy audio codec (preserve original)
                    '-c:v', 'copy',          // Copy video codec (preserve original)
                    '-hls_time', '10',       // Segment duration
                    '-hls_list_size', '0',   // Number of playlist entries (0 means unlimited)
                    '-hls_segment_filename', `${uploadPath}_%03d.ts`,  // Output segment pattern
                    `${uploadPath}.m3u8`     // Output HLS playlist file
                ]);
        
                // Handle FFmpeg process events
                ffmpegProcess.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
        
                ffmpegProcess.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });
        
                ffmpegProcess.on('close', (code) => {
                    if (code === 0) {
                        console.log('FFmpeg process finished successfully');
                    } else {
                        console.error(`FFmpeg process exited with code ${code}`);
                    }
        
                    // Cleanup: Delete the temporary video file
                    fs.unlink(tempFilePath, (err) => {
                        if (err) {
                            console.error('Error deleting temporary file:', err);
                        }
                    });
                });
        
                ffmpegProcess.on('error', (error) => {
                    console.error('Error executing FFmpeg:', error);
                });
        
                // Return response with .m3u8 file details
                return {
                    filename: `${uniqueFilename}.m3u8`,
                    mimetype: 'application/x-mpegURL', // Assuming .m3u8 is used for HLS
                    url: `http://localhost:5000/videos/${uniqueFilename}.m3u8`
                };
            } catch (error) {
                console.error('Error uploading video:', error);
                throw new Error('Failed to upload the file');
            }
        },
        async likeVideo(_, { id }, context, info) {
            const userId = verify(context)
            let userid
            await userId.then((value) => {
                userid = value;
            });
            await Videos.findByIdAndUpdate(id, { $push: { likesID: userid } })
            await User.findByIdAndUpdate(userid, { $inc: { likes: 1 } }, { new: true })
            return "Success like video with success"
        },
        async dislikeVideo(_, { id }, context, info) {
            const userId = verify(context)
            let userid
            await userId.then((value) => {
                userid = value;
            });
            await Videos.findByIdAndUpdate(id, { $pull: { likesID: userid } })
            await User.findByIdAndUpdate(userid, { $inc: { likes: -1 } }, { new: true })
            return "dislike video with success"
        },
    }
}





/*
 async uploadVideo(_, { file }) {
            try {
                const authClient=await authorize()
                const pipelineAsync = promisify(pipeline);
                const { createReadStream, filename, mimetype } = await file;
                const uniqueFilename = `${uuidv4()}-${filename}`;
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                const drive = google.drive({version:'v3',auth:authClient}); 
                const uploadPath = path.join(__dirname, 'public', 'videos', uniqueFilename);
                const tempDir = path.join(__dirname, 'public', 'videos');
                const tempFilePath = path.join(tempDir, `${uniqueFilename}.m3u8`);
                const folderId = '1sCO0vWSA8xodepLsV4MZG8qh5vm19gRP';
                await pipelineAsync(// Use pipeline to handle the stream and file operations
                    createReadStream(),
                    createWriteStream(tempFilePath)
                );
                const media = {
                    mimeType: 'application/x-mpegURL',
                    body: createReadStream(tempFilePath) // Use createReadStream to read the file
                };
                const uploadedFile = await drive.files.create({
                    resource: {
                        name: uniqueFilename,
                        mimeType: 'application/x-mpegURL',
                        parents: [folderId]
                    },
                    media: media,
                    fields: 'id'
                });
                const ffmpegCommand = [
                    '-i', tempFilePath,
                    '-c:a', 'aac',
                    '-ac', '2',
                    '-b:a', '160k',
                    '-c:v', 'h264',
                    '-b:v', '800k',
                    '-hls_time', '10',
                    '-hls_list_size', '0',
                    uploadPath
                ];
                console.log('FFmpeg Command:', ffmpegCommand.join(' '));
                const ffmpegProcess = spawn(ffmpegPath, ffmpegCommand);// Spawn ffmpeg process
                ffmpegProcess.on('close', (code) => {   // Handle process events
                    if (code === 0) {
                        //fsPromises.unlink(uploadPath);// Remove the mp4 file
                        console.log('FFmpeg process finished successfully');
                    } else {
                        console.error(`FFmpeg process exited with code ${code}`);
                    }
                });
                ffmpegProcess.on('error', (error) => {
                    console.error('Error executing FFmpeg:', error);
                });
                console.log('File uploaded to Google Drive:', uploadedFile.data);
                return {
                    filename: `${uniqueFilename}.m3u8`,
                    mimetype,
                    url: `http://localhost:5000/videos/${uniqueFilename}`,
                };
            } catch (error) {
                console.error(error);
                throw new Error('Failed to upload the file');
            }
        },  
        */