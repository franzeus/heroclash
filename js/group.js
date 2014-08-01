var Group = function(name) {
  this.id = name;
  this.creatures = [];
  this.deadCreatures = 0;
};

Group.prototype.isDead = function() {
  return this.deadCreatures >= this.creatures.length;
};

Group.prototype.attackedBy = function(group, creaturesGetKilled) {
  if (this.isDead()) {
    console.warn(this.id, ' can not be attacked');
    return;
  }

  if (creaturesGetKilled !== 0) {
    this.remove(creaturesGetKilled);
  } else {
    console.log(this.id, 'did not lose any', creaturesGetKilled);
  }
};

Group.prototype.add = function(creature) {
  this.creatures.push(creature);
  creature.group = this;
  return this;
};

Group.prototype.remove = function(number) {
  var numberOfLosses = this.deadCreatures + number;
  this.deadCreatures = Math.min(this.creatures.length, numberOfLosses);
  console.log(this.id, "Dead: " + this.deadCreatures);
  return this;
};

