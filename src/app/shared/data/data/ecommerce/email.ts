export interface email {
  id: number;
  title: string;
  status: boolean;
  badge?: number;
  color?: string;
  icon: string;
  data: data[];
}

export interface data {
  id: number;
  active: boolean;
  isOpens: boolean,
  image?: string;
  name: string;
  title: string;
  subTitle: string;
  time: string;
  profileclass?: string;
  statusColor2?: string;
  status?: string;
  status2?: string;
  statusColor?: string;
  imgName?: string;
}

export const emailFilter: email[] = [
  {
    id: 1,
    title: "Inbox",
    status: true,
    badge: 12,
    icon: "inbox",
    data: [
      {
        id: 1,
        active: true,
        isOpens: false,
        image: "assets/images/user/6.jpg",
        name: "Marvin McKinney",
        title: "New comments on MSR2023 draft presentation",
        subTitle: "New Here's a list of all the topic challenges...",
        time: "2:30 PM",
        status: "new",
        statusColor: "primary",
      },
      {
        id: 2,
        active: false,
        isOpens: false,
        image: "assets/images/user/3.png",
        name: "Brooklyn Simmons",
        title: "Confirm your booking id",
        subTitle:
          "A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "7:50 AM",
        status: "deadline",
        statusColor: "primary",
      },
      {
        id: 3,
        active: false,
        isOpens: false,
        name: "Esther Howard",
        title: "Confirm your booking id",
        subTitle:
          "craft beer labore wes anderson cred nesciunt sapiente ea proident...",
        time: "1:00 PM",
        status: "work",
        statusColor: "success",
        profileclass: "primary",
        imgName: "EH",
      },
      {
        id: 4,
        active: true,
        isOpens: false,
        name: "Cameron Williamson",
        title: "Very fiction Link",
        subTitle:
          "Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.",
        time: "5 Day ago",
        statusColor: "success",
        profileclass: "success",
        imgName: "CW",
      },
      {
        id: 5,
        active: false,
        isOpens: false,
        image: "assets/images/user/6.jpg",
        name: "Ronald Richards",
        title: "Confirm your booking id",
        subTitle:
          "Confirm your booking id - A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "7 April",
        status: "Update.Zip",
        statusColor: "light",
      },
      {
        id: 6,
        active: false,
        isOpens: false,
        image: "assets/images/user/10.jpg",
        name: "Darlene Robertson",
        title: "Promotion Mail",
        subTitle:
          "Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda ...",
        time: "04 April",
        status: "Import File..",
        statusColor: "light",
      },
      {
        id: 7,
        active: true,
        isOpens: false,
        image: "assets/images/user/12.png",
        name: "Jacob Jones",
        title: "Welcome to our new office",
        subTitle:
          "A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "01 April",
      },
      {
        id: 8,
        active: false,
        isOpens: false,
        image: "assets/images/user/3.png",
        name: "Ralph Edwards",
        title: "Your Order #224820098 has been Confirmed",
        subTitle:
          "A collection of textile samples lay spread out on the table...",
        time: "1:00 PM",
      },
      {
        id: 9,
        active: false,
        isOpens: false,
        image: "assets/images/user/6.jpg",
        name: "Ronald Richards",
        title: "Confirm your booking id",
        subTitle:
          "Confirm your booking id - A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "7 April",
        status: "Update.Zip",
        statusColor: "light",
      },
      {
        id: 10,
        profileclass: "success",
        active: false,
        isOpens: false,
        imgName: "WT",
        name: "William Turner",
        title: "Very fiction Link",
        subTitle:
          "Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.",
        time: "5 Day ago",
      },
      {
        id: 11,
        active: false,
        isOpens: false,
        image: "assets/images/user/12.png",
        name: "Jacob Jones",
        title: "Welcome to our new office",
        subTitle:
          "A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "01 April",
      },
      {
        id: 12,
        active: false,
        isOpens: false,
        image: "assets/images/user/3.png",
        name: "Ralph Edwards",
        title: "Your Order #224820098 has been Confirmed-",
        subTitle:
          "A collection of textile samples lay spread out on the table...",
        time: "1:00 PM",
      },
    ],
  },
  {
    id: 2,
    title: "Sent",
    status: false,
    icon: "sent",
    data: [
      {
        id: 1,
        active: false,
        isOpens: false,
        image: "assets/images/user/14.png",
        name: "Brooklyn Simmons",
        title: "Confirm your booking id",
        subTitle:
          "A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "7:50 AM",
        status: "new",
        statusColor: "primary",
      },
      {
        id: 2,
        active: false,
        isOpens: false,
        image: "assets/images/user/6.jpg",
        name: "Marvin McKinney",
        title: "New comments on MSR2023 draft presentation",
        subTitle: "New Here's a list of all the topic challenges...",
        time: "2:30 PM",
        status: "new",
        statusColor: "primary",
      },
      {
        id: 3,
        active: false,
        isOpens: false,
        profileclass: "primary",
        statusColor2: "success",
        imgName: "EH",
        name: "Esther Howard",
        title: "Confirm your booking id",
        subTitle:
          "craft beer labore wes anderson cred nesciunt sapiente ea proident...",
        time: "1:00 PM",
        status: "new",
        status2: "Task",
        statusColor: "primary",
      },
      {
        id: 4,
        active: false,
        isOpens: false,
        profileclass: "success",
        imgName: "JW",
        name: "Jack Williamson",
        title: "Very fiction Link",
        subTitle:
          "Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.",
        time: "5 Day ago",
      },
    ],
  },
  {
    id: 3,
    title: "Starred",
    status: false,
    icon: "star",
    data: [
      {
        id: 1,
        active: true,
        isOpens: false,
        image: "assets/images/user/6.jpg",
        name: "Marvin McKinney",
        title: "New comments on MSR2023 draft presentation ",
        subTitle: "New Here's a list of all the topic challenges...",
        time: "2:30 PM",
        status: "new",
        statusColor: "primary",
      },
      {
        id: 2,
        active: true,
        isOpens: false,
        image: "assets/images/user/3.png",
        name: "Brooklyn Simmons",
        title: "Confirm your booking id",
        subTitle:
          "A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "7:50 AM",
        status: "new",
        statusColor: "primary",
      },
    ],
  },
  {
    id: 4,
    title: "Draft",
    status: false,
    icon: "draft",
    data: [
      {
        id: 1,
        active: false,
        isOpens: false,
        image: "assets/images/user/3.png",
        name: "Ralph Edwards",
        title: "Your Order #224820098 has been Confirmed",
        subTitle:
          "A collection of textile samples lay spread out on the table...",
        time: "1:00 PM",
      },
      {
        id: 2,
        active: false,
        isOpens: false,
        image: "assets/images/user/6.jpg",
        name: "Ronald Richards",
        title: "Confirm your booking id",
        subTitle:
          "Confirm your booking id - A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "7 April",
        status: "Update.Zip",
        statusColor: "light",
      },
      {
        id: 3,
        profileclass: "success",
        active: false,
        isOpens: false,
        imgName: "CW",
        name: "Cameron Williamson",
        title: "Very fiction Link",
        subTitle:
          "Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.",
        time: "5 Day ago",
        statusColor: "success",
      },
      {
        id: 4,
        active: false,
        isOpens: false,
        image: "assets/images/user/12.png",
        name: "Jacob Jones",
        title: "Welcome to our new office",
        subTitle:
          "A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "01 April",
      },
      {
        id: 5,
        active: false,
        isOpens: false,
        image: "assets/images/user/3.png",
        name: "Ralph Edwards",
        title: "Your Order #224820098 has been Confirmed",
        subTitle:
          "A collection of textile samples lay spread out on the table...",
        time: "1:00 PM",
      },
    ],
  },
  {
    id: 5,
    title: "Trash",
    status: false,
    icon: "trash",
    data: [
      {
        id: 1,
        active: false,
        isOpens: false,
        imgName: "EH",
        profileclass: "primary",
        name: "Esther Howard",
        title: "Confirm your booking id",
        subTitle:
          "craft beer labore wes anderson cred nesciunt sapiente ea proident...",
        time: "1:00 PM",
        status: "offer",
        statusColor: "secondary",
      },
      {
        id: 2,
        active: false,
        isOpens: false,
        profileclass: "success",
        imgName: "CH",
        name: "Cameron Hill",
        title: "Very fiction Link",
        subTitle:
          "Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.",
        time: "5 Day ago",
        statusColor: "success",
      },
      {
        id: 3,
        active: false,
        isOpens: false,
        imgName: "EH",
        name: "Esther Howard",
        title: "Confirm your booking id",
        subTitle:
          "craft beer labore wes anderson cred nesciunt sapiente ea proident...",
        time: "1:00 PM",
        status: "new",
        status2: "Task",
        profileclass: "primary",
        statusColor: "primary",
        statusColor2: "success",
      },
      {
        id: 4,
        profileclass: "success",
        active: false,
        isOpens: false,
        imgName: "CW",
        name: "Cameron Williamson",
        title: "Very fiction Link",
        subTitle:
          "Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.",
        time: "5 Day ago",
        statusColor: "success",
      },
    ],
  },
  {
    id: 6,
    title: "Work",
    status: false,
    color: "stroke-primary",
    icon:'pintag',
    data: [
      {
        id: 1,
        active: false,
        isOpens: false,
        imgName: "EH",
        profileclass: "primary",
        name: "Esther Howard",
        title: "Confirm your booking id",
        subTitle:
          "craft beer labore wes anderson cred nesciunt sapiente ea proident...",
        time: "1:00 PM",
        status2: "Task",
        status: "new",
        statusColor: "primary",
        statusColor2: "success",
      },
      {
        id: 2,
        active: false,
        isOpens: false,
        image: "assets/images/user/3.png",
        name: "Brooklyn Simmons",
        profileclass: "success",
        title: "Confirm your booking id",
        subTitle:
          "A collection of textile samples lay spread out on the table - Samsa was a travelling salesman..",
        time: "7:50 AM",
        status: "deadline",
        statusColor: "primary",
      },
      {
        id: 3,
        active: false,
        isOpens: false,
        imgName: "EV",
        statusColor: "primary",
        statusColor2: "success",
        name: "Esther Voward",
        title: "Confirm your booking id",
        subTitle:
          "craft beer labore wes anderson cred nesciunt sapiente ea proident...",
        time: "1:00 PM",
        status2: "work",
        status: "new",
        profileclass: "primary",
      },
    ],
  },
  {
    id: 7,
    title: "Private",
    status: false,
    color: "stroke-warning",
    icon:'pintag',
    data: [
      {
        id: 1,
        active: false,
        isOpens: false,
        profileclass: "primary",
        imgName: "AD",
        title: "Confirm your booking id",
        subTitle:
          "craft beer labore wes anderson cred nesciunt sapiente ea proident...",
        time: "1:00 PM",
        status: "new",
        status2: "Task",
        name: "Asther Dolly",
        statusColor: "primary",
        statusColor2: "success",
      },
    ],
  },
  {
    id: 8,
    title: "Support",
    status: false,
    color: "stroke-success",
    icon:'pintag',
    data: [
      {
        id: 1,
        active: false,
        isOpens: false,
        imgName: "EH",
        name: "Esther Howard",
        title: "Confirm your booking id",
        subTitle:
          "craft beer labore wes anderson cred nesciunt sapiente ea proident...",
        time: "1:00 PM",
        status: "new",
        status2: "Task",
        profileclass: "primary",
        statusColor: "primary",
        statusColor2: "success",
      },
      {
        id: 2,
        profileclass: "success",
        active: false,
        isOpens: false,
        imgName: "CW",
        name: "Cameron Williamson",
        title: "Very fiction Link",
        subTitle:
          "Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.",
        time: "5 Day ago",
      },
    ],
  },
];

export const tabData = [
  {
    id: 1,
    title: "Important",
    value: "important",
    icon: "mail",
  },
  {
    id: 2,
    title: "Social",
    value: "social",
    icon: "goal",
  },
  {
    id: 3,
    title: "Promotion",
    value: "promotion",
    icon: "tread",
  },
];
