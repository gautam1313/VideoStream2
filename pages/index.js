import { gql, GraphQLClient } from "graphql-request";
import Section from "../components/Section";
import NavBar from "../components/NavBar";
import Link from "next/link";
import Image from "next/image";
import disney from "../public/disney-button.png";
import marvel from "../public/marvel-button.png";
import natgeo from "../public/natgeo-button.png";
import starwars from "../public/star-wars-button.png";

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
          <Link href="#disney">
            <div className="franchise" id="disney">
              <Image src={disney} />
            </div>
          </Link>
          <Link href="#marvel">
            <div className="franchise" id="marvel">
              <Image src={marvel} />
            </div>
          </Link>
          <Link href="#natgeo">
            <div className="franchise" id="natgeo">
              <Image src={natgeo} />
            </div>
          </Link>
          <Link href="#starwars">
            <div className="franchise" id="starwars">
              <Image src={starwars} />
            </div>
          </Link>
        </div>
        <Section genre={"Recommended for you"} videos={unseenVideos(videos)} />
        <Section genre={"Comedy"} videos={filterVideos(videos, "comedy")} />
        <Section genre={"Sci-fi"} videos={filterVideos(videos, "sci-fi")} />
        <Section genre={"Thriller"} videos={filterVideos(videos, "thriller")} />
        <Section genre={"Action"} videos={filterVideos(videos, "action")} />
        <Section
          genre={"Animation"}
          videos={filterVideos(videos, "animation")}
        />
        <Section
          id="marvel"
          genre={"Marvel"}
          videos={filterVideos(videos, "marvel")}
        />
        <Section
          id="natgeo"
          genre={"National Geographic"}
          videos={filterVideos(videos, "travel")}
        />
        <Section
          id="disney"
          genre={"Disney"}
          videos={filterVideos(videos, "disney")}
        />
        <Section
          id="starwars"
          genre={"Star Wars"}
          videos={filterVideos(videos, "starwars")}
        />
      </div>
    </>
  );
};

export default Home;
