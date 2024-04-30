type INavigation = {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
};

type ITech = {
  imageUri: string;
  name: string;
};

type IProject = {
  name: string;
  summary: string;
  startTime: string;
  endTime: string;
  teckStack: string[];
  previewImages: string[];
  uri: string;
  githubUri?: string;
};

type IExperience = {
  companyName: string;
  comanyLogo: string;
  positionWork: string;
  startTime: string;
  endTime: string;
  summary: string;
  tags: string[];
};
