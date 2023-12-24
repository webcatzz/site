const changelog = {
  "aug 8": [{"some index tweaks...": ["reorganized widgets a bit", "prettied up tunes widget", "track names now include the composer"]}, "added cbox! yell at me"],
  "aug 3": ['added a "peek" button to tracks on the tunes page, so you can now view them in jummbox!'],
  "aug 1": [{"index page v5!!!!": ["now i gotta get all these other pages back up and running..."]}, "added beepbox webring"],
  "june 26": ["gonna start using this again LOL", "linked izutsumi shrine on about page, also added some more images of... *dreamy sigh* her", "uploaded an mp100 page i made when i was still watching mp100 but i never uploaded here for some reason. that one isn't linked anywhere though", "gregbutevil"],
  "april 17": ["new about page design"],
  "april 9": ['"lol what if i do a it again"', "(remade home page x2 combo)", "(well just styling mostly the layout is the same i guess)", "blog page is up (again)"],
  "march 7": ["added some hidden links to the about me page"],
  "march 6": ["some site buttons on the misc. page now display comments if you hover over them"],
  "march 5": ["added JUICE launch countdown to about me page", "readded corkboard in the form of the misc. page"],
  "february 23": ["redesigned about me page", "added new track to music page"],
  "february 15": ["added about me page", "added sitemap", "added under construction page"],
  "february 10": ["remade home page (yahoo!)"]
};


function loadLatest(container, date) {
  let latest = Object.keys(changelog)[0];
  date.innerHTML += latest;
  container.insertAdjacentHTML("afterbegin", array_to_list(changelog[latest]));
}


function loadAll(container) {
  let html = ``;
  for (let i = 0; i < Object.keys(changelog).length; i++) {
    html += `
      <div>${Object.keys(changelog)[i]}</div>
      ${array_to_list(changelog[Object.keys(changelog)[i]])}
    `;
  };
  container.insertAdjacentHTML("afterbegin", html);
}

function array_to_list(array) {
  let list = ``;

  for (let i = 0; i < array.length; i++) {
    if (typeof(array[i]) == "string") {
      list += `<li>${array[i]}</li>`
    } else {
      list += `<li>${Object.keys(array[i])[0]}${array_to_list(array[i][Object.keys(array[i])[0]])}</li>`
    }
  }

  return `<ul>${list}</ul>`;
}