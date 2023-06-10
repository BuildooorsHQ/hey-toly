// ./pages/api/getListedCollectionNFTs/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { HYPERSPACE_CLIENT } from "../../../constants.ts";

type NFTListing = {
  price: number;
  image: string;
  token: string;
};

type ListedNFTResponse = {
  listings: NFTListing[];
  hasMore: boolean;
};

async function hyperspaceGetListedCollectionNFTs(
  projectId: string,
  pageSize = 5,
  priceOrder = "DESC"
): Promise<ListedNFTResponse> {
  let listedNFTs: NFTListing[] = [];
  let hasMore = true;
  let pageNumber = 1;
  while (listedNFTs.length < pageSize && hasMore) {
    const results = await HYPERSPACE_CLIENT.getMarketplaceSnapshot({
      condition: {
        projects: [{ project_id: projectId }],
        onlyListings: true,
      },
      orderBy: {
        field_name: "lowest_listing_price",
        sort_order: priceOrder as any,
      },
      paginationInfo: {
        page_number: pageNumber,
      },
    });

    const snaps = results.getMarketPlaceSnapshots.market_place_snapshots ?? [];
    const orderedListings = snaps.sort(
      (a, b) =>
        (a.lowest_listing_mpa?.price ?? 0) - (b.lowest_listing_mpa?.price ?? 0)
    );

    pageNumber += 1;
    const crucialInfo: NFTListing[] = orderedListings
      .filter(
        (arr) =>
          arr.lowest_listing_mpa?.marketplace_program_id !==
          "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
      )
      .map((arr) => ({
        price: arr.lowest_listing_mpa?.price ?? 0,
        token: arr.token_address,
        image: arr.meta_data_img ?? "",
        marketplace: arr.lowest_listing_mpa?.marketplace_program_id ?? "",
      }));
    listedNFTs = listedNFTs.concat(crucialInfo);
    hasMore = results.getMarketPlaceSnapshots.pagination_info.has_next_page;
  }

  return {
    listings: listedNFTs.slice(0, pageSize),
    hasMore,
  };
}

export default async function getListedCollectionNFTs(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("getListedCollectionNFTs: Request received", req.body);

    const { projectId, pageSize, priceOrder } = req.body;

    // Perform your logic here to retrieve the NFTs
    const result = await hyperspaceGetListedCollectionNFTs(
      projectId,
      pageSize,
      priceOrder
    );

    console.log("getListedCollectionNFTs: NFTs retrieved", result);

    res.status(200).json(result);
  } catch (error) {
    console.error("getListedCollectionNFTs: Error occurred", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
