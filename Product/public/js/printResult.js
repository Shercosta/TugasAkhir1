document.getElementById("print").addEventListener("click", () => {
  document.getElementById("print").hidden = "true";
  window.print();
  document.getElementById("print").hidden = "false";
});
