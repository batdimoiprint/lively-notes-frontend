import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const cld = new Cloudinary({ cloud: { cloudName: "dllnqngt4" } });

interface CloudPicsProps {
  id: string;
}

export function useCloudPics({ id }: CloudPicsProps) {
  if (!id) return null;

  const image = cld
    .image(id)
    .format("auto")
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(1000).height(1000));
  return image;
}
