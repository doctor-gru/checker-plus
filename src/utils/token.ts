export const getTokenImage = (tokenId) => {
    const imagePrefix = "https://bronze-accused-cat-898.mypinata.cloud/ipfs/QmZP8LAzmJqDkoHdg95mJiBrWj8eDBbXozSWS1B88ZRCtx/GPU%20";
    const imageSuffix = ".png";
   return `${imagePrefix}${tokenId}${imageSuffix}` ||"";
}

export const getRarity = (tokenId) => {
    const rarities = {
      '2': 'Entry Level',
      '4': 'Entry Level',
      '8': 'Entry Level',
      '10': 'Entry Level',
      '1': 'Mid Range',
      '3': 'Mid Range',
      '5': 'Mid Range',
      '7': 'Mid Range',
      '9': 'Mid Range',
      '6': 'High End',
    };
  
    return rarities[tokenId] || 'Unknown';
  };

  export const tokenMetadata = {
    title: "PinLink GPU Token Metadata",
    name: "PinLink GPU Token",
    type: "object",
    owner:"PinLink",
    image:
      "https://bronze-accused-cat-898.mypinata.cloud/ipfs/QmepDXZ3Wz4oR9vq58LvLqB4gwHRseHiW6QH4NzbcPcv1c",
    description:
      "This token represents ownership of a fraction of a GPU resource in the PinLink network.",
    properties: {
      name: {
        type: "string",
        description: "Identifies the GPU asset to which this token represents",
      },
      decimals: {
        type: "integer",
        description:
          "The number of decimal places that the token amount should display - e.g. 18 means to divide the token amount by 1000000000000000000 to get its user representation.",
      },
      description: {
        type: "string",
        description: "Describes the GPU asset to which this token represents",
      },
      image: {
        type: "string",
        description:
          "A URI pointing to a resource with mime type image/* representing the GPU asset to which this token represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.",
      },
      properties: {
        type: "object",
        description:
          "Arbitrary properties. Values may be strings, numbers, objects, or arrays.",
      },
      localization: {
        type: "object",
        required: ["uri", "default", "locales"],
        properties: {
          uri: {
            type: "string",
            description:
              "The URI pattern to fetch localized data from. This URI should contain the substring {locale} which will be replaced with the appropriate locale value before sending the request.",
          },
          default: {
            type: "string",
            description: "The locale of the default data within the base JSON",
          },
          locales: {
            type: "array",
            description:
              "The list of locales for which data is available. These locales should conform to those defined in the Unicode Common Locale Data Repository (http://cldr.unicode.org/).",
          },
        },
      },
    },
    attributes: [
      {
        trait_type: "Model",
        value: "NVIDIA RTX 3090",
      },
      {
        trait_type: "Memory",
        value: "24 GB GDDR6X",
      },
      {
        trait_type: "Cores",
        value: "10496 CUDA Cores",
      },
      {
        trait_type: "Clock Speed",
        value: "1.70 GHz",
      },
      {
        trait_type: "Power Consumption",
        value: "350W",
      },
      {
        trait_type: "Hashrate",
        value: "120 MH/s",
      }      
    ],
  };