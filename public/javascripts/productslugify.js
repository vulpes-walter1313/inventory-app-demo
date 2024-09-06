const slugifyBtn = document.querySelector("#slug-btn");

slugifyBtn.addEventListener("click", async () => {
  const productName = document.getElementById("name").value;
  const rawRes = await fetch("/api/slugify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: productName }),
  });

  const res = await rawRes.json();
  if (res.success) {
    document.getElementById("slug").value = res.slug;
  }
});
