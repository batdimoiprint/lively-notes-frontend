import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const cld = new Cloudinary({ cloud: { cloudName: "dllnqngt4" } });

interface CloudPicsProps {
  id: number[];
  randomizedId: number;
}

export function useCloudPics({ id, randomizedId }: CloudPicsProps) {
  if (
    !Array.isArray(id) ||
    id.length === 0 ||
    randomizedId == null ||
    randomizedId < 0 ||
    randomizedId >= id.length
  ) {
    return null;
  }
  const image = cld
    .image(`${id[randomizedId]}`)
    .format("auto")
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(1000).height(1000));
  return image;
}
