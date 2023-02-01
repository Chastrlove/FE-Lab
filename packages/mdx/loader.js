module.exports = function (content, map, meta) {
  const lang = "tsx";
  const result = `\`\`\`${lang}\n${content}\`\`\``;
  this.callback(null,result,map, meta);
};
