import React, { Fragment } from 'react'
import { isElementOfType } from 'react-dom/test-utils';
import Helmet from 'react-helmet'
import questions from '../../questions.json'
import isEmpty from '../../utils/is-empty'
import M from 'materialize-css';
import correctNotifocation from '../../assets/audio/correct-answer.mp3';
import wrongNotification from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3';


class Play extends React.Component {

    constructor() {
        super()
        this.state = {
            questions: questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberOfQuestions: 1,
            numberOfAnswerQuestion: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnwers: 0,
            wrongAnswers: 0,
            hint: 5,
            fiftyFifty: 2,
            userFiftyFifty: false,
            time: {}
        };
    }

    //cQ:currentQuestion,nQ :nextQuestion ,pQ:previousQuestion
    displayQuestions = (questions = this.state.questions, cQ, nQ, pQ) => {
        let { currentQuestionIndex } = this.state;

        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            cQ = this.state.questions[currentQuestionIndex];
            nQ = this.state.questions[currentQuestionIndex + 1];
            pQ = this.state.questions[currentQuestionIndex - 1];
            const answer = cQ.answer
            this.setState({
                currentQuestion: cQ,
                nextQuestion: nQ,
                previousQuestion: pQ,
                answer: answer
            })
        }
    }

    componentDidMount() {
        this.displayQuestions();
    }

    handleOptionClick = (e) => {

        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            setTimeout(() => {
                document.getElementById('correct-answer').play();
            }, 500)

            this.correctAnswer();
        }
        else {
            setTimeout(() => {
                document.getElementById('wrong-answer').play();
            }, 500)

            this.wrongAnswer();
        }
    }

    correctAnswer = () => {
        M.toast({
            html: 'Correct Answer !',
            classes: 'toast-valid',
            displayLength: 1500
        })
        this.setState(prevState => ({

            score: prevState.score + 1,
            correctAnwers: prevState.correctAnwers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnswerQuestion: prevState.numberOfAnswerQuestion + 1,
            numberOfQuestions: this.state.numberOfQuestions + 1

        }), () => {
            this.displayQuestions(
                this.state.questions,
                this.state.currentQuestion,
                this.state.nextQuestion,
                this.state.previousQuestion
            );
        })
    }

    wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer !',
            classes: 'toast-invalid',
            displayLength: 1500
        })
        this.setState(prevState => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnswerQuestion: prevState.numberOfAnswerQuestion + 1,
            numberOfQuestions: this.state.numberOfQuestions + 1
        }), () => {
            this.displayQuestions(
                this.state.questions,
                this.state.currentQuestion,
                this.state.nextQuestion,
                this.state.previousQuestion
            );

        })
    }

    handleNextButton = () => {
        this.playButtonSound();
        if (this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1,
                numberOfQuestions: this.state.numberOfQuestions + 1
            }), () => {
                this.displayQuestions(
                    this.state.questions,
                    this.state.currentQuestion,
                    this.state.nextQuestion,
                    this.state.previousQuestion
                );
            });
        }
    }


    handlePreviousButton = () => {
        this.playButtonSound();
        if (this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1,
                numberOfQuestions: this.state.numberOfQuestions - 1
            }), () => {
                this.displayQuestions(
                    this.state.questions,
                    this.state.currentQuestion,
                    this.state.nextQuestion,
                    this.state.previousQuestion
                );
            });
        }
    }

    handleQuitButton = () => {
        this.playButtonSound();
        if (window.confirm('are you sure you want to quit ?')){
            this.props.history.push('/');
        }
    }

    handleButtonClick = (e) => {
        switch (e.target.id) {

            default:
                break
            case 'next-button':
                this.handleNextButton();
                break;
            case 'previous-button':
                this.handlePreviousButton();
                break;
            case 'quit-button':
                this.handleQuitButton();
                break;



        }



    }

    playButtonSound = () => {
        document.getElementById('button-sound').play();
    }







    render() {

        const { currentQuestion } = this.state
        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <Fragment>
                    <audio id="correct-answer" src={correctNotifocation}></audio>
                    <audio id="wrong-answer" src={wrongNotification}></audio>
                    <audio id="button-sound" src={buttonSound}></audio>
                </Fragment>
                <div className="questions">
                    <h2>Quiz Mode</h2>
                    <div className="lifeline-container">
                        <p>

                            <span className="lifeline-icon"><i className="fa fa-hand-peace-o" aria-hidden="true"></i></span>
                            <span className="lifeline">2</span>
                        </p>

                        <p>
                            <span style={{ position: "relative", left: "-6px" }} className="lifeline">5</span>
                            <span className="lifeline-icon"><i className="fa fa-lightbulb-o" aria-hidden="true"></i></span>

                        </p>
                    </div>

                    <div>
                        <p>

                            <span className="left">{this.state.numberOfQuestions} of {this.state.questions.length} </span>
                            <span className="right">2:15<span><i style={{ position: "relative", left: "4px" }} className="fa fa-clock-o" aria-hidden="true"></i></span></span>
                        </p>
                    </div>

                    <h5>{currentQuestion.question}?</h5>
                    <div className="options-container">

                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>

                    </div>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>


                    </div>

                    <div className="button-container">
                        <button id="previous-button" onClick={this.handleButtonClick}>Previous</button>
                        <button id="next-button" onClick={this.handleButtonClick} >Next</button>
                        <button id="quit-button" onClick={this.handleButtonClick} >Quit</button>
                    </div>

                </div>
            </Fragment>
        )
    }
}


export default Play