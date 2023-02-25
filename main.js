// url to deezer api
const deezer_api_url = "https://api.deezer.com";

// https://www.deezer.com/us/album/264266592
const album_of_the_year_id = "264266592";


const cors_proxy = "http://cors-anywhere.herokuapp.com/";

const fetchAlbum = async (id) => {
  const album_url = `${deezer_api_url}/album/${id}`;
  const response = await fetch(cors_proxy + album_url);
  const album_data = await response.json();

  if (album_data.error) {
    displayError(album_data.error.message);
    return undefined;
  }
  return album_data;
};

const fetchTracks = async (tracklist_url) => {
  const response = await fetch(cors_proxy + tracklist_url);
  const tracklist_data = await response.json();

  if (tracklist_data.error) {
    displayError(tracklist_data.error.message);
    return undefined;
  }
  return tracklist_data;
};

const displayAlbumHTML = (album_element, album_data) => {
  const { id, title, cover_big, artist, release_date, tracklist, nb_tracks } =
    album_data;

  album_element.innerHTML = `
    <article class="article article_album">
			<header> <h2>${title}</h2> </header>
            <aside class="aside aside_article">
                <h3>Artist: ${artist.name}</h3>
                <p>Release Date: ${release_date}</p>
                <p>${nb_tracks} tracks</p>
                <p class="view_tracks"><a href="details.html?url=${tracklist}" >View Tracklist</a></p>
            </aside>
            <div className="content">
                <figure>
                    <img src="${cover_big}" alt="${title}">
                </figure>
            </div>
		</article>
    `;
};

const displayTracklistHTML = (tracklist_element, tracklist_data) => {
  const { data } = tracklist_data;
  let tracklist_item_html = "";
  data.forEach((track) => {
    const { id, title, preview, artist, duration } = track;
    tracklist_item_html += `
            <li>
                <dl class="track_details track_details_${id}">
                    <dt>
                        ${title}
                        <span class="duration">
                            (${convertDuration(duration)})
                        </span>
                    </dt>
                    <dd><a href="${preview}" >Preview</a></dd>
                </dl>
            </li>
        `;
  });

  const tracklist_html = `<ul>${tracklist_item_html}</ul>`;
  tracklist_element.innerHTML = tracklist_html;
};

const displayError = (message) => {
  const error = document.getElementById("error_message");
  error.innerHTML = `
    <p class="error">${message}</p>
  `;
};

const isDetailsPage = () => {
  const path_name = window.location.pathname;
  if (path_name.includes("details.html")) {
    return true;
  }
  return false;
};

const getTracklistURL = () => {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const tracklist_url = url.searchParams.get("url");
  return tracklist_url;
};

// display duration in minutes and seconds
const convertDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration - minutes * 60;
  return `${minutes}:${seconds}`;
};

const app = async () => {
  const loadingMessage = document.getElementById("loading-message");
  // Show the loading message
  loadingMessage.classList.remove("hidden");

  if (isDetailsPage()) {
    const tracklist_element = document.getElementById("track_list");
    const tracklist_url = getTracklistURL();

    const tracklist_data = await fetchTracks(tracklist_url);

    if (tracklist_data !== undefined) {
      displayTracklistHTML(tracklist_element, tracklist_data);
    }
  } else {
    const album_element = document.getElementById("album_info");
    const album_data = await fetchAlbum(album_of_the_year_id);
    if (album_data !== undefined) {
      displayAlbumHTML(album_element, album_data);
    }
  }
  loadingMessage.classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", app);
