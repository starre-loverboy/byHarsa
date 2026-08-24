export interface COLORPOOLPROPS {
  text: string;
  value: string[]; 
}

const COLORPOOL: COLORPOOLPROPS[] = [
  { text: 'red', value: ['#FF4136', 'red'] },
  { text: 'blue', value: ['#0074D9', 'blue'] },
  { text: 'green', value: ['#2ECC40', 'green'] },
  { text: 'yellow', value: ['#FFDC00', 'yellow'] },
  { text: 'purple', value: ['#B10DC9', 'purple'] },
  { text: 'orange', value: ['#FF851B', 'orange'] },
];

export default COLORPOOL