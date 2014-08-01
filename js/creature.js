var Creature = function(options) {
  this.id = getRandomId();
  options = options || {};
  this.group = null;
  this.type = 'CREATURE';
  this.isDead = false;
  extend(this, options);
};

Creature.prototype.setDead = function() {
  this.isDead = true;
};
