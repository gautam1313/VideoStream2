import { gql, GraphQLClient } from "graphql-request";

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;
  const graphQLClient = new GraphQLClient(process.env.ENDPOINT, {
    headers: {
      authorization: process.env.GRAPH_CMS_TOKEN,
    },
  });
  const query = gql`
    query($pageSlug: String) {
      video(where: { slug: $pageSlug }) {
        createdAt
        id
        title
        description
        seen
        slug
        tags
        thumbnail {
          url
        }
        mp4 {
          url
        }
      }
    }
  `;

  const variables = {
    pageSlug,
  };

  const data = await graphQLClient.request(query, variables);
  const video = data.video;
  return {
    props: {
      video,
    },
  };
};

const Video = ({ video }) => {
  console.log(video);
  return <div></div>;
};

export default Video;
