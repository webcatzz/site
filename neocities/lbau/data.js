const data = {
  levels: [
    [true, true, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false]
  ],
  isUnlocked: (section, level) => {return data.levels[section - 1][level - 1]},
  unlock: (section, level) => {data.levels[section - 1][level - 1] = true},

  loadLevel: (section, level) => location.href = "level.html#" + (level - 1)
};