import React from "react";

import Button from "../components/Button.jsx";
import LegacyInfo from "../components/LegacyInfo.jsx";

const About = ({ goToProject }) => (
  <main className="main-content about">
    <section className="content-wrapper">
      <LegacyInfo />
      <h2 className="about__title">
        <span className="about__title__part">Design. </span>
        <span className="about__title__part">Preview. </span>
        <span className="about__title__part">Generate. </span>
      </h2>
      <div className="about__logo">
        <img src="static/images/sequelize-ui.svg" />
      </div>
      <p className="info">
        <strong>Sequelize UI</strong> provides a user-friendly interface for
        designing a relational database and generating&nbsp;
        <a href="https://sequelize.org/" target="_blank">
          Sequelize ORM
        </a>
        &nbsp; model code for a Node.js project.
      </p>
      <div className="preview">
        <video
          controls
          loop
          src="static/images/build.mp4"
          alt="Demo of creating a model using the GUI"
        />
      </div>
      <p className="info">
        Use the code previewer to see the generated Sequelize code for your
        models, including configuration such as table/column name casing and
        pluralization.
      </p>
      <div className="preview">
        <video
          controls
          loop
          src="static/images/preview.mp4"
          alt="Demo of previewing generated Sequelize code"
        />
      </div>
      <p className="info">
        Download your generated Sequelize project, and run it immediately.
      </p>
      <div className="preview">
        <video
          controls
          loop
          src="static/images/download.mp4"
          alt="Demo of downloading and running generated Sequelize code"
        />
      </div>
      <div className="get-started">
        <Button
          className="get-started__button"
          primary
          label="Get Started"
          onClick={goToProject}
        />
      </div>
    </section>
  </main>
);
export default About;
