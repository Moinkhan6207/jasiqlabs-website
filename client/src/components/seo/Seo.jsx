import { Helmet } from "react-helmet-async";

export default function Seo({ title, description }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
    </Helmet>
  );
}











