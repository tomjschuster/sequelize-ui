import React from 'react'

import Button from '../components/Button.jsx'

const About = ({ goToProject }) => (
  <main className='main-content about'>
    <section className='content-wrapper'>
      <h2 className='about__title'>
        <span className='about__title__part'>Design. </span>
        <span className='about__title__part'>Preview. </span>
        <span className='about__title__part'>Generate. </span>
      </h2>
      <div className='about__logo'>
        <img src='static/images/sequelize-ui.svg' />
      </div>
      <p className='info'>
        <strong>Sequelize UI</strong> provides a user-friendly interface for
        designing a relational database and generating&nbsp;
        <a href='https://sequelize.org/' target='_blank'>
          Sequelize ORM
        </a>
        &nbsp; model code for a Node.js project.
      </p>
      <figure className='preview-gif'>
        <img
          src='static/images/build.gif'
          alt='Demo of creating a model using the GUI'
        />
      </figure>
      <p className='info'>
        Use the code previewer to see the generated Sequelize code for your
        models, including configuration such as table/column name casing and
        pluralization.
      </p>
      <figure className='preview-gif'>
        <img
          src='static/images/preview.gif'
          alt='Demo of previewing generated Sequelize code'
        />
      </figure>
      <p className='info'>
        Download your generated Sequelize project, and run it immediately.
      </p>
      <figure className='preview-gif'>
        <img
          src='static/images/download.gif'
          alt='Demo of downloading and running generated Sequelize code'
        />
      </figure>
      <div className='get-started'>
        <Button
          className='get-started__button'
          primary
          label='Get Started'
          onClick={goToProject}
        />
      </div>
    </section>
  </main>
)
export default About
