import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client'
import { useSelector } from 'react-redux';
const ApolloProviders = () => {
    const user = useSelector((state: any) => state.user)
    /*const httpLink = createHttpLink({
        uri: 'http://localhost:5000/',
    });*/
    const uploadLink = createUploadLink({
        uri: 'http://localhost:5000/graphql',
    });

    const authLink = setContext((_, { headers }) => {
        //const token = localStorage.getItem('jwtToken');
        return {
            headers: {
                ...headers,
                authorization: user ? `Bearer ${user?.user?.Login?.token?user?.user?.Login?.token:user?.user?.UpdateUser?.token}` : '',
            },
        };
    });

    const client = new ApolloClient({
        link: ApolloLink.from([authLink, uploadLink]),
        cache: new InMemoryCache(),
    });

    return (
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    );
};

export default ApolloProviders;