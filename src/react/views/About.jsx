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
      <p className='info'>
        <strong>Sequelize UI</strong> provides a user-friendly interface for
        designing SQL database models and generating{' '}
        <a href='https://sequelize.org/'>Sequelize</a> code for a Node.js
        project.
      </p>
      <p className='info'>
        Use the code previewer to look the Sequelize code needed to generate
        your model while you configure your database, creating columns and add
        constraints.
      </p>
      <p className='info'>
        Download your complete Sequelize project, or just a single file, or copy
        the code to include in an existing project.
      </p>
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
