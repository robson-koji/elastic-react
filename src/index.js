import React from 'react';
import ReactDOM from 'react-dom';

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';



ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <App />
    </I18nextProvider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



/* 
// Teste Loader

import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component {
  state = {
    loading: true
  };

  componentDidMount() {
    // this simulates an async action, after which the component will render the content
    demoAsyncCall().then(() => this.setState({ loading: false }));
  }
  
  render() {
    const { loading } = this.state;
    
    if(loading) { // if your component doesn't have to wait for an async action, remove this block 
      return null; // render null when app is not ready
    }
    
    return (
      <div>I'm the app</div>
    ); 
  }
}

function demoAsyncCall() {
  return new Promise((resolve) => setTimeout(() => resolve(), 2500));
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
*/