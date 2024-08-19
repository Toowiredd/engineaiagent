import { getXataClient } from "./xata";

const xata = getXataClient();

const fetchData = async () => {
  const page = await xata.db.Toowireds.getPaginated({
    pagination: {
      size: 15,
    },
  });

  console.log(page.records);
};

fetchData();
