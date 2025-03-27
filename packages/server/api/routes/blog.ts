import { GoogleGenerativeAI } from '@google/generative-ai'
import { Request, Response, Router } from 'express'
import { authHandler } from '../middleware/authHandler.js'
import Blog from '../models/blog.js'
import { envConfig } from '../utils/envConfig.js'

const router = Router()

const genAI = new GoogleGenerativeAI(envConfig.geminiApiKey)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096,
  responseModalities: ['text'],
  responseMimeType: 'application/json',
}

// Generate blog content
router.post('/generate', authHandler, async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    })

    const result = await chatSession.sendMessage(`User prompt: "${prompt}".
      
      You are a helpful assistant that generates blog posts based on user prompts.
      
              Your responses must be a JSON object has the following schema:
              * title: Title of the blog post
              * content: Content of the blog post in markdown format. The content should not contain title.
      `)

    // if (!result.response) {
    //   res
    //     .status(500)
    //     .json({ error: 'Error generating content: No response received' })
    //   return
    // }

    // const candidates = result.response.candidates
    // if (candidates) {
    //   for (
    //     let candidate_index = 0;
    //     candidate_index < candidates.length;
    //     candidate_index++
    //   ) {
    //     for (
    //       let part_index = 0;
    //       part_index < candidates[candidate_index].content.parts.length;
    //       part_index++
    //     ) {
    //       const part = candidates[candidate_index].content.parts[part_index]
    //       if (part.inlineData) {
    //         try {
    //           const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`
    //           fs.writeFileSync(
    //             filename,
    //             Buffer.from(part.inlineData.data, 'base64'),
    //           )
    //           console.log(`Output written to: ${filename}`)
    //         } catch (err) {
    //           console.error(err)
    //         }
    //       }
    //     }
    //   }
    //   console.log(result.response.text())
    // }

    // const text = result.response.text()
    // const cleanText = text.replace(/^```markdown\n?/, '').replace(/```$/, '')

    // const title = cleanText.split('\n')[0]
    // const content = cleanText.split('\n').slice(1).join('\n').trim()

    // res.json({ title, content })

    if (
      result.response.promptFeedback &&
      result.response.promptFeedback.blockReason
    ) {
      throw new Error(
        `Blocked for ${result.response.promptFeedback.blockReason}`,
      )
    }

    if (!result.response.text()) {
      throw new Error('Exceeded quota or no response received')
    }

    const cleanJson = JSON.parse(result.response.text())
    const title = cleanJson.title
    const content = cleanJson.content

    // console.log(title, content)

    res.status(200).json({ title: title, content: content })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Error generating content: ' + errorMessage })
  }
})

// Save blog
router.post(
  '/',
  authHandler,
  async (req: Request & { userId?: string }, res: Response) => {
    try {
      const { title, content } = req.body
      // const blog = new Blog({ title, content, author: req.userId })
      // await blog.save()

      const blog = await Blog.create({
        author: req.userId,
        title: title.trim(),
        content: content.trim(),
      })
      if (!blog) {
        throw new Error()
      }
      res.status(201).json({ message: 'Blog saved successfully!' })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: 'Error saving blog: ' + errorMessage })
    }
  },
)

// Get all blogs for the user
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    if (page < 1) {
      res.status(400).json({ error: 'Invalid page number' })
      return
    }

    if (limit < 1) {
      res.status(400).json({ error: 'Invalid limit number' })
      return
    }

    const skip = (page - 1) * limit

    const totalBlogs = await Blog.countDocuments()
    const blogs = await Blog.find()
      .populate('author', 'email')
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      blogs,
      pagination: {
        total: totalBlogs,
        page,
        limit,
        pages: Math.ceil(totalBlogs / limit),
      },
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Error fetching blogs: ' + errorMessage })
  }
})

// Get blogs by search query
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const order = (req.query.order as string) || 'desc'
    const author = req.query.author as string

    if (!query) {
      res.status(400).json({ error: 'Query parameter is required' })
      return
    }

    if (page < 1) {
      res.status(400).json({ error: 'Invalid page number' })
      return
    }

    if (limit < 1) {
      res.status(400).json({ error: 'Invalid limit number' })
      return
    }

    const skip = (page - 1) * limit

    // Build the search query
    const searchCriteria: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    }

    // Add author filter if provided
    if (author) {
      searchCriteria.author = author
    }

    // Count total matching documents
    const totalBlogs = await Blog.countDocuments(searchCriteria)

    // Get search results with pagination and sorting
    const blogs = await Blog.find(searchCriteria)
      .populate('author', 'email')
      .sort({ createdAt: order === 'desc' ? 'desc' : 'asc' })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      blogs,
      pagination: {
        total: totalBlogs,
        page,
        limit,
        pages: Math.ceil(totalBlogs / limit),
      },
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Error fetching blogs: ' + errorMessage })
  }
})

// Get a single blog by ID
router.get('/:blogId', async (req: Request, res: Response) => {
  const blogId = req.params.blogId
  try {
    console.log(blogId)
    const blog = await Blog.findById(blogId).populate('author', 'email')
    if (!blog) {
      console.log('Blog not found')
      res.status(404).json({ error: 'Blog not found' })
      return
    }
    res.status(200).json({ blog: blog })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Error fetching blog: ' + errorMessage })
  }
})

export default router
