import React, { Component } from 'react'
import learnService from '../../services/learn-service'
import './LearningRoute.css'

class LearningRoute extends Component {
  state = {
    nextWord: null,
    wordCorrectCount: 0,
    incorrect: 0,
    totalScore: 0,
    isCorrect: null,
    error: null
  }

  componentDidMount() {
    learnService.getWord()
      .then(res => {
        this.setState({
          nextWord: res.nextWord,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount,
          totalScore: res.totalScore,
        })
      });
  }

  nextQ = () => {
    learnService.getWord()
      .then(res => {
        this.setState({
          nextWord: res.nextWord,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount,
          totalScore: res.totalScore,
          isCorrect: null,
          error: null
        })
      });
  }

  handleSubmit = e => {
    e.preventDefault()

    const { guessInput } = e.target;

    if(guessInput.value === ' ') {
      this.setState({error: 'Invalid guess'});
      guessInput.value = "";
    }
    else {
      learnService.checkAnswer(guessInput.value)
      .then(res => {
        this.setState({
          currentWord: this.state.nextWord,
          guess: guessInput.value,
          nextWord: res.nextWord,
          totalScore: res.totalScore,
          wordCorrectCount: res.wordCorrectCount,
          wordIncorrectCount: res.wordIncorrectCount,
          answer: res.answer,
          isCorrect: res.isCorrect
        })
  
      })
      .catch(err => {
        console.error(err.error)
      })
  
    }
  }

  render() {
    const {error} = this.state;
    if(this.state.isCorrect === null){
      return (
        <section className='Learning-Route'>
          <h2>Translate the word:</h2>
          <div className='Learning-Route-alert' role='alert'>
            {error && <p>{error}</p>}
          </div>
            <span className='Learning-Route-new-word'>{this.state.nextWord}</span>
          <form onSubmit = {(e) => this.handleSubmit(e)}>
            <label htmlFor='learn-guess-input'>What's the translation for this word?</label>
            <input 
              type='text' 
              placeholder='answer' 
              name='guessInput' 
              id='learn-guess-input'
              aria-label='Learn guess input'
              aria-required='true'
              required
              ></input>
            <button type='submit'>Submit your answer</button>
          </form>
          <section className='Learning-Route-scores'>
            <p className='Learning-Route-first-score'>Your total score is: {this.state.totalScore}</p>
            <p>You have answered this word correctly {this.state.wordCorrectCount} times.</p>
            <p>You have answered this word incorrectly {this.state.wordIncorrectCount} times.</p>
          </section>
        </section>
      );
    }

    if(this.state.isCorrect === true){

      return(
        <div className='DisplayScore-container'>
          <div className='DisplayScore'>
            <p>Your total score is: {this.state.totalScore}</p>
          </div>
          <h2 className='correct'>You were correct! :D</h2>
          <div className='DisplayFeedback'>
            <p>The correct translation for {this.state.currentWord} was {this.state.answer} and you chose {this.state.guess}!</p>
          </div>
          <button type='button' onClick={this.nextQ}>Try another word!</button>
        </div>
      )
    }

    if(this.state.isCorrect === false){
      return(
        <div className='DisplayScore-container'>
          <div className='DisplayScore'>
            <p>Your total score is: {this.state.totalScore}</p>
          </div>
          <h2 className='incorrect'>Good try, but not quite right :(</h2>
          <div className='DisplayFeedback'>
            <p>The correct translation for {this.state.currentWord} was {this.state.answer} and you chose {this.state.guess}!</p>
          </div>
          <button type='button' onClick={this.nextQ}>Try another word!</button>
        </div>
      )
    }
  }
}

export default LearningRoute
