//new URLSearchParams(new URL('http://localhost:3001/a.html?xyz=1&y=2&z=3').search).get('xyz')
async function handle_login() {
	const ldap = document.getElementById("ldap").value;
	const passwd = document.getElementById("passwd").value;

	const res = await fetch("http://localhost:3000/api/v1/login", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		body: `ldap=${ldap}&passwd=${passwd}`
	});

	if (!res.ok) {
		alert("Invalid credentials!");
	} else {
		const jsonres = await res.json();
		console.log(jsonres);
		window.location = "http://localhost:3001/dashboard.html"
	}
}

function init_dashboard() {
	// add events to ol
	fetch("http://localhost:3000/api/v1/events", {
		method: "GET",
		mode: "cors",
		credentials: "include"
	}).then((res) => {
		let event_ol = document.getElementById("event_ol");
		
		res.json().then((jsonres) => {
			jsonres.forEach((e) => {
				let newli = document.createElement("li");
				let a = document.createElement("a");
				a.setAttribute("href", `event.html?id=${e.id}`);
				a.innerHTML = e.name;
				newli.appendChild(a);
				newli.setAttribute("id", e.id);
				event_ol.appendChild(newli);
			});
		});
	});	

	// add coordinators to ol
	fetch("http://localhost:3000/api/v1/coordinators", {
		method: "GET",
		mode: "cors",
		credentials: "include"
	}).then((res) => {
		let coordie_ol = document.getElementById("coordie_ol");
		
		res.json().then((jsonres) => {
			jsonres.forEach((e) => {
				let newli = document.createElement("li");
				newli.appendChild(document.createTextNode(`${e.name} - ${e.id}`));
				newli.setAttribute("id", e.id);
				coordie_ol.appendChild(newli);
			});
		});
	});

	// add organizers to ol
	fetch("http://localhost:3000/api/v1/organizers", {
		method: "GET",
		mode: "cors",
		credentials: "include"
	}).then((res) => {
		let orgie_ol = document.getElementById("orgie_ol");
		
		res.json().then((jsonres) => {
			jsonres.forEach((e) => {
				let newli = document.createElement("li");
				newli.appendChild(document.createTextNode(e.name));
				newli.setAttribute("id", e.id);
				orgie_ol.appendChild(newli);
			});
		});
	});
}

function init_event() {
	// get id of event from the URL and fetch that event
	const evid = parseInt(new URLSearchParams(window.location.search).get('id'));
	fetch(`http://localhost:3000/api/v1/events/${evid}`, {
		method: "GET",
		mode: "cors",
		credentials: "include"
	}).then((res) => {
		let evname = document.getElementById("evname");
		let evdesc = document.getElementById("evdesc");

		let coordie_ol = document.getElementById("coordie_ol");
		
		res.json().then((jsonres) => {
			evname.value = jsonres.name;
			evdesc.value = jsonres.desc;
			jsonres.coordinators.forEach((e) => {
				let newli = document.createElement("li");
				newli.appendChild(document.createTextNode(e.name));
				newli.setAttribute("id", e.id);
				coordie_ol.appendChild(newli);
			})
		});
	});
}

function update_event() {
	const evid = parseInt(new URLSearchParams(window.location.search).get('id'));
	let evname = document.getElementById("evname");
	let evdesc = document.getElementById("evdesc");
	let newcids = document.getElementById("newcids");

	var uebody = `name=${evname.value}&desc=${evdesc.value}`;
	newcids.value.replace(" ", "").split(",").forEach((e) => {
		uebody += `&coordinators=${e}`;
	});

	fetch(`http://localhost:3000/api/v1/updateevent/${evid}`, {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		body: encodeURI(uebody)
	}).then((res) => {
		if (res.ok) {
			window.location = "http://localhost:3001/dashboard.html";
		} else {
			alert("Server Error!");
		}
	});
}

function add_coordinator() {
	const ldap = document.getElementById("cldap").value;
	const name = document.getElementById("cname").value;

	fetch("http://localhost:3000/api/v1/coordinators", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		body: `ldap=${ldap}&name=${name}`
	}).then((res) => {
		if (res.ok) {
			window.location = "http://localhost:3001/dashboard.html";
		} else {
			alert("Server Error!");
		}
	});
}

