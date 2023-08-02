const BASEURL = `https://picsum.photos/v2/list`;
const PER_PAGE = 9;

export async function fetchImages(page) {
  try {
    const res = await fetch(`${BASEURL}?page=${page}&limit=${PER_PAGE}`);
    return res.json();
  } catch (error) {
    console.log('Fetch images error:', error);
  }
}
