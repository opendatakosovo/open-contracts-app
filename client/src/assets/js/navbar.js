const urlArray = window.location.href.split("/");
const sq = {
    "description": "Këtu mund të gjeni të dhënat e hapura për kontratat në komunën e Prishtinës.",
    "title": "Kontratat e Hapura",
    "image": "http://kontratatehapura.prishtinaonline.com/assets/images/social-media.jpg",
    "url": "http://kontratatehapura.prishtinaonline.com/sq"
}
const en = {
    "description": "Here you can find the open data for contracts in the municipality of Pristina.",
    "title": "Open Contracts",
    "image": "http://kontratatehapura.prishtinaonline.com/assets/images/english.jpg",
    "url": "http://kontratatehapura.prishtinaonline.com/en"
}
const sr = {
    "description": "Ovde možete pronaći otvorene podatke za ugovore u opštini Priština.",
    "title": "Javni Ugovori",
    "image": "http://kontratatehapura.prishtinaonline.com/assets/images/srpski.jpg",
    "url": "http://kontratatehapura.prishtinaonline.com/sr"
}
const facebook_description = document.querySelector('meta[property="og:description"]');
const facebook_title = document.querySelector('meta[property="og:title"]');
const facebook_image_url = document.querySelector('meta[property="og:image:url"]');
const facebook_url = document.querySelector('meta[property="og:url"]');
const facebook_site_name = document.querySelector('meta[property="og:site_name"]');

const twitter_title = document.querySelector('meta[property="twitter:title"]');
const twitter_description = document.querySelector('meta[property="twitter:description"]');
const twitter_image = document.querySelector('meta[property="twitter:image"]');
if (urlArray[urlArray.length - 1] == 'sq') {
    // Facebook meta tags
    facebook_description.setAttribute("content", sq.description);
    facebook_title.setAttribute("content", sq.title);
    facebook_image_url.setAttribute("content", sq.image);
    facebook_url.setAttribute("content", sq.url);
    facebook_site_name.setAttribute("content", sq.title);

    // Twitter meta tags
    twitter_title.setAttribute("content", sq.title);
    twitter_description.setAttribute("content", sq.description);
    twitter_image.setAttribute("content", sq.image);
} else if (urlArray[urlArray.length - 1] == 'sr') {
    // Facebook meta tags
    facebook_description.setAttribute("content", sr.description);
    facebook_title.setAttribute("content", sr.title);
    facebook_image_url.setAttribute("content", sr.image);
    facebook_url.setAttribute("content", sr.url);
    facebook_site_name.setAttribute("content", sr.title);

    // Twitter meta tags
    twitter_title.setAttribute("content", sr.title);
    twitter_description.setAttribute("content", sr.description);
    twitter_image.setAttribute("content", sr.image);
} else if (urlArray[urlArray.length - 1] == 'en') {
    // Facebook meta tags
    facebook_description.setAttribute("content", en.description);
    facebook_title.setAttribute("content", en.title);
    facebook_image_url.setAttribute("content", en.image);
    facebook_url.setAttribute("content", en.url);
    facebook_site_name.setAttribute("content", en.title);

    // Twitter meta tags
    twitter_title.setAttribute("content", en.title);
    twitter_description.setAttribute("content", en.description);
    twitter_image.setAttribute("content", en.image);
}
$(document).ready(() => {
    // navbar transition
    $(window).scroll(function () {
        var height = $(window).scrollTop();

        if (height >= 114) {
            $("#navbar-1").addClass("scroll");
        } else {
            $("#navbar-1").removeClass("scroll");

        }
    });
})
