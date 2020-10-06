import React, { Component, Fragment } from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router-dom'

export default class QuizSummary extends Component {

    constructor() {
        super()
        this.state = {
            score: 0,
            numberOfQuestions: 0,
            numberOfAnswersQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            usedHints: 0,
            usedFiftyFifty: 0
        }
    }

    componentDidMount() {
        const { state } = this.props.location;

        if (state) {
            this.setState({
                score: (state.score / state.numberOfQuestions) * 100,
                numberOfQuestions: state.numberOfQuestions,
                numberOfAnswersQuestions: state.numberOfAnswerQuestion,
                correctAnswers: state.correctAnwer,
                wrongAnswers: state.wrongAnswer,
                usedHints: state.hintUsed,
                usedFiftyFifty: state.fiftyUsed

            })
        }
    }
    render() {

        const { state } = this.props.location;
        let stats ,remark;
        if (this.state.score <=30){
            remark = 'You need more practice !';
        } else if(this.state.score >30  && this.state.score <=50 ){
            remark = 'Better luck next time !';
        }else if (this.state.score<=70 && this.state.score >50){
            remark = 'You can do better!';
        }else if (this.state.score >=71 && this.state.score <=84){
            remark = 'You did Great!';
        }else { remark = 'You are an absolute genius!';}


        if (state !== undefined) {
            stats = (

                <Fragment>

                <div>
                    <div className="ok-icone"><i className="fa fa-check-circle-o fa-5x" aria-hidden="true"></i></div>
                    </div>
                    <h2 style={{textAlign:"center",color:"#57b846" ,marginTop:"1px"}}>Quiz has ended</h2>
                    <div className="container" style={{width:"fit-content"}}>
                    <h3 style={{textAlign:"center"}}>{remark}</h3>
                    <h4 style={{textAlign:"center" ,color:"blue"}}>Your score : {this.state.score.toFixed(0)}&#37;</h4>

                    <span className="stat left">Total number of questions :</span>
                    <span className="right">{this.state.numberOfQuestions}</span><br/>

                    <span className="stat left">Number of attempted questions :</span>
                    <span className="right">{this.state.numberOfAnswersQuestions}</span><br/>

                    <span className="stat left">Number of Correct Answers :</span>
                    <span className="right">{this.state.correctAnswers}</span><br/>

                    <span className="stat left">Number of Wrong Answers:</span>
                    <span className="right">{this.state.wrongAnswers}</span><br/>

                    <span className="stat left">Hints Used:</span>
                    <span className="right">{this.state.usedHints}</span><br/>

                    <span className="stat left">50-50 Used:</span>
                    <span className="right">{this.state.usedFiftyFifty}</span><br/>

                    </div>
                    <div className="sectionLink">

                        <ul className="link">
                            <li>
                                <Link to="/">Back to Home</Link>
                            </li>

                            <li className="li-link">
                                <Link to="/play/Quiz">Play Again</Link>
                            </li>
                        </ul>

                    </div>

            </Fragment>


            );
        }

        else {
            stats = (
                <Fragment>
            
            <h1 className="no-stats">No Statistics available</h1>
            <section>
            <ul>
                <li>
                  <Link to="/">Back to Home</Link>
                </li>
                <li>
                 <Link to="/play/Quiz">Take Quiz </Link>
                </li>
            </ul>

        </section>

        </Fragment>
        );

        }


        return (

            <Fragment>
                <Helmet><title>Quiz App - Summary</title></Helmet>
              

                {stats}


            </Fragment>

        )
    }
}
