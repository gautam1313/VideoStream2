import { gql, GraphQLClient } from "graphql-request";
import { useState } from "react";

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

const watchedMovie = async (slug) => {
  await fetch("/api/watchedMovie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
  });
};

const Video = ({ video }) => {
  const [watching, setWatching] = useState(false);
  console.log(video);
  return (
    <>
      {!watching && (
        <>
          <img
            className="video-image"
            src={video.thumbnail.url}
            alt={video.title}
          />
          <div className="info">
            <p>{video.tags.join(", ")}</p>
            <p>{video.description}</p>
            <a href="/">go back</a>
            <br />
            <br />
            <button
              className="video-overlay"
              onClick={() => {
                watchedMovie(video.slug);
                setWatching(true);
              }}
            >
              PLAY
            </button>
          </div>
        </>
      )}
      {watching && (
        <>
          <button
            className="closeButton"
            onClick={() => {
              setWatching(false);
            }}
          >
            X
          </button>
          <video className="actualVideo" width="100%" controls>
            <source src={video.mp4.url} type="video/mp4" />
          </video>
        </>
      )}
    </>
  );
};

export default Video;
