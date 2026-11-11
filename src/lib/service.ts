import { HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient, gql } from "@apollo/client"
const client = new ApolloClient({
    link: new HttpLink({ uri: "https://countries.trevorblades.com/" }),
    cache: new InMemoryCache(),
});


export const useApi = () => {
    const validarCompatibilidad = async () => {
        client
            .query({
                query: gql`
query GetCountry {
  country(code: "US") {
    name
    capital
    code
  }
}
`,
            })
            .then((result) => console.log(result));
    }
    const guardarModelo = async (code) => {
        client
            .query({
                query: gql`
query GetCountry($code: ID!) {
  country(code: $code) {
    name
    capital
    code
  }
}
`,
                variables: { code }
            })
            .then((result) => console.log(result));
    }
    return {
        validarCompatibilidad,
        guardarModelo
    }
}