const fetchUsers = async () =>
  await (await fetch('/.netlify/functions/getusers')).json();

const fetchSN = async () =>
  await (await fetch('/.netlify/functions/getSN')).json();

const fetchTest = async () =>
  await (await fetch('/.netlify/functions/getTest')).json();

  //await (await fetch('/.netlify/functions/getSN')).json();

fetchUsers().then(data => {
  userList = document.querySelector('#users');

  data.forEach(user => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    const link = document.createElement('a');
    link.appendChild(document.createTextNode(user.login));
    link.href = user.html_url;
    link.target = '_blank';
    li.appendChild(link);
    userList.appendChild(li);
  });
});

fetchSN().then(newdata => {
  console.log("data")
  console.log(newdata)
});

fetchTest().then(test => {
  console.log("test")
  console.log(test)
});
