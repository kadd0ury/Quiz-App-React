import React, {Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import tech from '../../assets/img/tech.PNG'


const QuizInstructions = () => (


    <Fragment>
        <Helmet><title>Quiz Instructions</title></Helmet>
        <div className="instructions container" style={{ marginTop: "50px", marginBottom: "50px" }}>
            <h1>How to play Game</h1>
            <p>Ensure you read this guide from start to finish</p>
            <ul className="browser-default" id="main-list">
                <li>This game has a duration of 15 minutes and ends as soon as your time  elapses</li>
                <li>Each game  consists of  15 questions</li>
                <li>Every question of Quiz contains 4 options
              <img src={tech} alt="Quiz App options example" />
                </li>

                <li>Select the option  which best answers the questions by clicking (or selecting)it
              <img src={tech} alt="Quiz App options example" />
                </li>

                <li>Each game has 2 lifelines namely :
                  <ul id="sublist">
                        <li> - 2 50-50 chances</li>
                        <li> - 5 Hints</li>
                    </ul>

                </li>


                <li>

                    selecting 50-50 lifelines by clicking on the icone &emsp;
                      <span className="lifeline-icon fa-1x"><i className="fa fa-hand-peace-o" aria-hidden="true"></i></span>
                      &emsp; will remove  2 wrong answers,leaving correct and wrong answer
                      <img src={tech} alt="Quiz App options example" />
                </li>

                <li>

                    Using a hint by clicking the icon &emsp;
                      <span className="lifeline-icon fa-1x"><i className="fa fa-lightbulb-o" aria-hidden="true"></i></span>
                      &emsp; will remove one wrong answer leaving two wrong answers and one correct answer .You can use
                      as many hints as possible on a signle question.
                      <img src={tech} alt="going back" />

                </li>
                <li>Feel free to quit (or retire from) the game at any time .In that case your score will be
                revealed afterwards.
                  </li>
                <li> The timer starts  as soon as the game  loads.</li>
                <li>Let's do this if you think yo've got what takes ? </li>

            </ul>
            <div style={{ marginBottom: "39px" }}>
                <span className="left"><Link to="/">
                <i class="fa fa-hand-o-left" aria-hidden="true"></i>
                    No take Me Back !
                    </Link>
                    </span>
                <span className="right"><Link to="/play/Quiz">
                    Okay let's go
                    <i class="fa fa-hand-o-right" aria-hidden="true"></i>
                    </Link>
               
                    </span>

            </div>



        </div>

    </Fragment>


);



export default QuizInstructions;