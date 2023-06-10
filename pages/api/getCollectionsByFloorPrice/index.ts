// ./pages/api/getCollectionsByFloorPrice/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { HYPERSPACE_CLIENT } from "../../../constants.ts";

type CollectionStats = {
  id: string;
  desc: string;
  img: string;
  website: string;
  floor_price: number;
};

/**
 * Provides a feed of NFT collections that the user can afford.
 */
async function hyperspaceGetCollectionsByFloorPrice(
  maxFloorPrice?: number,
  minFloorPrice?: number,
  pageSize = 5,
  orderBy = "DESC",
  humanReadableSlugs = false
) {
  let pageNumber = 1;
  let results: CollectionStats[] = [];
  let hasMore = true;
  while (results.length < pageSize && hasMore) {
    const projects = await HYPERSPACE_CLIENT.getProjects({
      condition: {
        floorPriceFilter: {
          min: minFloorPrice ?? null,
          max: maxFloorPrice ?? null,
        },
      },
      orderBy: {
        field_name: "floor_price",
        sort_order: orderBy as any,
      },
      paginationInfo: {
        page_size: 512,
        page_number: pageNumber,
      },
    });

    let stats: CollectionStats[] =
      projects.getProjectStats.project_stats
        ?.filter(
          (project) =>
            (project.volume_7day ?? 0) > 0 && (project.floor_price ?? 0) > 0
        )
        .map((project) => ({
          id: project.project_id,
          desc: project.project?.display_name ?? "",
          img: project.project?.img_url ?? "",
          website: project.project?.website ?? "",
          floor_price: project.floor_price ?? 0,
        })) ?? [];

    if (humanReadableSlugs) {
      stats = stats?.filter((stat) => {
        if (stat.id) {
          try {
            bs58.decode(stat.id);
            return false;
          } catch (err) {
            return true;
          }
        }
        return false;
      });
    }

    pageNumber += 1;
    console.log("\tFetching collection info... ", stats?.length, pageNumber);
    if (stats) {
      results = results.concat(stats);
    }
    hasMore = projects.getProjectStats.pagination_info.has_next_page;
  }

  return {
    projects: results.slice(0, pageSize),
    hasMore,
  };
}

export default async function getCollectionsByFloorPrice(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("getCollectionsByFloorPrice: Request received", req.body);

    const { maxFloorPrice, minFloorPrice, orderBy, pageSize, humanReadable } =
      req.body;
    const result = await hyperspaceGetCollectionsByFloorPrice(
      maxFloorPrice,
      minFloorPrice,
      pageSize,
      orderBy,
      humanReadable
    );

    console.log("getCollectionsByFloorPrice: Result retrieved", result);

    res.status(200).json(result);
  } catch (error) {
    console.error("getCollectionsByFloorPrice: Error occurred", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
