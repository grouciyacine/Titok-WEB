

type Props = {
    type:string,
    placeholder:string,
    onChange:any,
    name:string,
    textarea:boolean,
    emoji?:boolean,
    value?:string
}

function Input({onChange,placeholder,type,name,textarea,emoji,value}: Props) {
if(textarea){
  return(
    <div className="bg-zinc-800 p-2 m-2 relative rounded-md  mx-2 w-full h-28 flex flex-row items-center justify-start">
    <textarea name={name} className="bg-transparent text-white peer  flex-1 z-20 outline-none border-none"   onChange={onChange}/>
    <label className="text-gray-400 absolute left-0 p-2 -translate-y-7 duration-150 transform z-10 origin-[0] peer-placeholder-shown:-translate-y-11 peer-placeholder-shown:scale-100 peer-focus:-translate-y-11">{placeholder}</label>
</div>
  )
}if(emoji){
  return(
    <div className="bg-zinc-800 p-2 m-2 relative rounded-md  mx-2 w-96 h-16 flex flex-row items-center justify-start">
        <input value={value} name={name} className="bg-transparent text-white peer pt-5 flex-1 z-20 outline-none border-none" type={type}  onChange={onChange}/>
        <label className="text-gray-400 absolute left-0 p-2 -translate-y-2 duration-150 transform z-10 origin-[0] peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4">{placeholder}</label>
    </div>
  )
}
else{
    return (
    <div className="bg-zinc-800 p-2 m-2 relative rounded-md  mx-2 w-96 h-16 flex flex-row items-center justify-start">
        <input name={name} className="bg-transparent text-white peer pt-5 flex-1 z-20 outline-none border-none" type={type}  onChange={onChange}/>
        <label className="text-gray-400 absolute left-0 p-2 -translate-y-2 duration-150 transform z-10 origin-[0] peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4">{placeholder}</label>
    </div>
  )
}

}

export default Input