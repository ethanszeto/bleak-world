function handleTimeInterval(counter, rate, elapsedTime, callback) {
  counter[0] += elapsedTime;
  if (counter > rate) {
    callback();
    counter[0] = counter[0] - rate;
  }
}
