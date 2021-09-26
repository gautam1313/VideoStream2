import { gql, GraphQLClient } from "graphql-request";

export default async (req, res) => {
  const mutatePublishGraphQL = new GraphQLClient(process.env.ENDPOINT, {
    headers: {
      authorization: process.env.GRAPH_CMS_TOKEN,
    },
  });

  const mutateQuery = gql`
    mutation($slug: String) {
      updateVideo(where: { slug: $slug }, data: { seen: true }) {
        id
        title
        seen
      }
    }
  `;
  await mutatePublishGraphQL.request(mutateQuery, { slug: req.body.slug });

  const publishQuery = gql`
    mutation($slug: String) {
      publishVideo(where: { slug: $slug }, to: PUBLISHED) {
        slug
      }
    }
  `;
  await mutatePublishGraphQL.request(publishQuery, { slug: req.body.slug });

  res.status(201).json({ slug: req.body.slug });
};
