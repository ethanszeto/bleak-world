function handleTimeInterval(counter, rate, elapsedTime, callback) {
  counter += elapsedTime;
  if (counter > rate) {
    callback();
    counter -= rate;
  }
}
