import Layout from "@lib/components/Layout";
import { file, FileItem } from "@lib/core";
import React from "react";

function IndexPage(): React.ReactElement {
  return (
    <Layout title="Home | Sequelize UI">
      {JSON.stringify(file("foo", "bar") as FileItem)}
    </Layout>
  );
}

export default IndexPage;
