
import { ethers } from "ethers";
import { gql, useQuery } from "@apollo/client";

const SALE_ENTIIES = gql`
  query GetSaleEntity {
    saleEntities  {
      price
      tokenId
      seller
      buyer
    }
  }
`;

export const Activity = () => {
  const { loading, error, data } = useQuery(SALE_ENTIIES);

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
        </div>
      </header>
      <main>
        {loading ? (
          <>
            <p>...Loading</p>
          </>
        ) : (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8  h-screen">
            <div className="px-4 py-6 sm:px-0  h-full ">
              <div className="p-1">
                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700 w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className=" text-center py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Token ID
                      </th>
                      <th
                        scope="col"
                        className=" text-center py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Seller
                      </th>
                      <th
                        scope="col"
                        className=" text-center py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Buyer
                      </th>
                      <th
                        scope="col"
                        className=" text-center py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {data?.saleEntities.slice(0).reverse().map((item: any) => (
                      <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                          {item.tokenId}
                        </td>
                        <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                          {item.seller.slice(0, 5) +
                            "..." +
                            item.seller.substring(item.seller.length - 4)}
                        </td>
                        <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                          {item.buyer.slice(0, 5) +
                            "..." +
                            item.seller.substring(item.buyer.length - 4)}
                        </td>
                        <td className="py-4 px-6 text-sm text-center font-medium text-gray-500 whitespace-nowrap dark:text-white">
                          {ethers.utils.formatUnits(item.price, 'gwei')} {" "} ETH
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
