export type Blog = {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    email: string
  }
  createdAt: string
  updatedAt: string
}
