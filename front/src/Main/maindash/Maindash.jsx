import React from 'react'
import Grid from '../grid/Grid'
import Mainheader from '../header/Main_header'

const robots=[
    {id:1, name: '프로그램명 -1 ', status: '작업 중'},/* api로 값 가져와서 넣은 곳 */
    {id:2, name: '프로그램명 -2 ', status: '대기 중'},/* api로 값 가져와서 넣은 곳 */
    {id:3, name: '프로그램명 -3 ', status: '작업 중'},/* api로 값 가져와서 넣은 곳 */
    {id:4, name: '프로그램명 -4 ', status: '작업 중'},/* api로 값 가져와서 넣은 곳 */
    {id:5, name: '프로그램명 -5 ', status: '작업 중'},/* api로 값 가져와서 넣은 곳 */
    {id:6, name: '프로그램명 -6 ', status: '에러 '}, /* api로 값 가져와서 넣은 곳 */
]


const Maindash = () => {
  return (
    <div>
        <Mainheader/>
        <Grid robots={robots}/>
    </div>
  )
}

export default Maindash