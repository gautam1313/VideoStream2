import { gql, GraphQLClient } from "graphql-request";
import Section from "../components/Section";
import NavBar from "../components/NavBar";

export const getStaticProps = async () => {
  const graphQLClient = new GraphQLClient(process.env.ENDPOINT, {
    headers: {
      authorization: process.env.GRAPH_CMS_TOKEN,
    },
  });

  const userid = process.env.USER_ID;

  const accountQuery = gql`
    query($userid: ID) {
      account(where: { id: $userid }) {
        username
        avatar {
          url
        }
      }
    }
  `;

  const variables = {
    userid,
  };
  const accountData = await graphQLClient.request(accountQuery, variables);
  const user = accountData.account;

  const videosQuery = gql`
    query {
      videos {
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

  const data = await graphQLClient.request(videosQuery);
  const videos = data.videos;

  return {
    props: {
      videos,
      user,
    },
  };
};

const Home = ({ videos, user }) => {
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)];
  };

  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre));
  };

  const unseenVideos = (videos) => {
    return videos.filter(
      (video) => video.seen === false || video.seen === null
    );
  };

  return (
    <>
      <NavBar account={user} />
      <div className="app">
        <div className="main-video">
          <img src={randomVideo(videos).thumbnail.url} />
        </div>
        <div className="video-feed">
          <Section
            genre={"Recommended for you"}
            videos={unseenVideos(videos)}
          />
          <Section genre={"Comedy"} videos={filterVideos(videos, "comedy")} />
          <Section genre={"Sci-fi"} videos={filterVideos(videos, "sci-fi")} />
          <Section
            genre={"Thriller"}
            videos={filterVideos(videos, "thriller")}
          />
          <Section genre={"Action"} videos={filterVideos(videos, "action")} />
          <Section
            genre={"Animation"}
            videos={filterVideos(videos, "animation")}
          />
          <Section genre={"Marvel"} videos={filterVideos(videos, "marvel")} />
          <Section
            genre={"National Geographic"}
            videos={filterVideos(videos, "travel")}
          />
          <Section genre={"Disney"} videos={filterVideos(videos, "disney")} />
          <Section
            genre={"Star Wars"}
            videos={filterVideos(videos, "star wars")}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
