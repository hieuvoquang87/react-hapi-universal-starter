/**
 * Created by hieuvo on 5/7/16.
 */
import Radium from 'radium';
import React from 'react';
import {render} from 'react-dom';
import style from './App.style';

@Radium
export default class App extends React.Component {
  render () {
    return <h2 style={style.app}> Hello server-side rendering</h2>;
  }
}