import type { NextPage, NextPageContext } from 'next';

interface Props {
    statusCode?: number
}

const Error: NextPage<Props> = ({ statusCode }) => {
    if(statusCode === 404) {
        return <h1>Page not found</h1>
    }else if(statusCode === 401) {
        return <h1>Unauthorized</h1>
    }
    return (
        <p>
        {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </p>
    );
  }
  
  Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
  }
  
  export default Error
