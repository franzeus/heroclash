var Group = function(name) {
  this.id = name;
  this.creatures = [];
  this.deadCreatures = 0;
  this.killedCreatures = 0;
  this.element = document.createElement('div');
  this.element.id = this.id;
  this.element.className = 'group';
  this.body = document.createElement('div');
  this.body.className = 'group_body';
  this.element.appendChild(this.body);
};

Group.prototype.draw = function(groupWidth) {
  this.element.style.width = groupWidth;
  this.body.innerHTML = '<div>' + this.id + '</div>';
  for (var i = 0; i < this.creatures.length; i++) {
    var creature = this.creatures[i];
    this.body.appendChild(creature.element);
  }
};

Group.prototype.isDead = function() {
  return this.deadCreatures >= this.creatures.length;
};

Group.prototype.attackedBy = function(group, creaturesGetKilled) {
  if (this.isDead()) {
    console.warn(this.id, ' can not be attacked - no creatures left!');
    return;
  }

  if (creaturesGetKilled !== 0) {
    this.remove(creaturesGetKilled);
    if (this.isDead()) {
      this.body.className += ' dead_group_body';
    }
  } else {
    console.log(this.id, 'did not lose any', creaturesGetKilled);
  }
};

Group.prototype.add = function(creature) {
  this.creatures.push(creature);
  creature.group = this;
  return this;
};

Group.prototype.killCreatures = function(number) {
  this.killedCreatures += number;
};

Group.prototype.setWinner = function(number) {
  this.body.className += ' winner_group_body';
};

Group.prototype.remove = function(number) {
  var numberOfLosses = this.deadCreatures + number;
  this.deadCreatures = Math.min(this.creatures.length, numberOfLosses);

  if (number > 0) {
    var count = 0;
    for (var i = 0; i < this.creatures.length; i++) {
      var current = this.creatures[i];
      if (current.isDead) {
        continue;
      }
      current.setDead();
      count++;
      if (count >= number) {
        break;
      }
    }
  }

  return this;
};

