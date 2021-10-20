const doc = document,
$table = doc.querySelector(".crud-table"),
$form = doc.querySelector(".crud-form"),
$title = doc.querySelector(".crud-title"),
$template = doc.getElementById("crud-template").content,
$fragment = doc.createDocumentFragment();

const getAll = async () => {
try {
  let res = await axios.get("http://localhost:3000/campeones"),
    json = await res.data;

  console.log(json);

  json.forEach(element => {
    $template.querySelector(".name").textContent = element.nombre;
    $template.querySelector(".region").textContent = element.region;
    $template.querySelector(".rol").textContent = element.rol;
    $template.querySelector(".edit").dataset.id = element.id;
    $template.querySelector(".edit").dataset.name = element.nombre;
    $template.querySelector(".edit").dataset.region = element.region;
    $template.querySelector(".edit").dataset.rol = element.rol;
    $template.querySelector(".delete").dataset.id = element.id;

    let $clone = doc.importNode($template, true);
    $fragment.appendChild($clone);
  });

  $table.querySelector("tbody").appendChild($fragment);
} catch (err) {
  let message = err.statusText || "Ocurrió un error";
  $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
}
}

doc.addEventListener("DOMContentLoaded", getAll);

doc.addEventListener("submit", async e => {
if (e.target === $form) {
  e.preventDefault();

  if (!e.target.id.value) {
    //Create - POST
    try {
      let options = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        },
        data: JSON.stringify({
          nombre: e.target.nombre.value,
          region: e.target.region.value,
          rol: e.target.rol.value
        })
      },
        res = await axios("http://localhost:3000/campeones", options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
  } else {
    //Update - PUT
    try {
      let options = {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        },
        data: JSON.stringify({
          nombre: e.target.nombre.value,
          region: e.target.region.value,
          rol: e.target.rol.value
        })
      },
        res = await axios(`http://localhost:3000/campeones/${e.target.id.value}`, options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
  }
}
});

doc.addEventListener("click", async e => {
if (e.target.matches(".edit")) {
  $title.textContent = "Editar Campeón";
  $form.nombre.value = e.target.dataset.name;
  $form.region.value = e.target.dataset.region;
  $form.rol.value = e.target.dataset.rol;
  $form.id.value = e.target.dataset.id;
}

if (e.target.matches(".delete")) {
  let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);

  if (isDelete) {
    //Delete - DELETE
    try {
      let options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=utf-8"
        }
      },
        res = await axios(`http://localhost:3000/campeones/${e.target.dataset.id}`, options),
        json = await res.data;

      location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      alert(`Error ${err.status}: ${message}`);
    }
  }
}
});