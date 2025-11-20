import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Todo, CreateTodoInput, TodosApiResponse } from "@/types/todo";

export async function GET(): Promise<NextResponse<TodosApiResponse>> {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-todo");

    const todos = await db
      .collection<Todo>("todos")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serializedTodos: Todo[] = todos.map((todo) => ({
      ...todo,
      _id: todo._id.toString(),
      id: todo._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedTodos,
    });
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<TodosApiResponse>> {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-todo");

    const body: CreateTodoInput = await request.json();
    const { title, description } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        { status: 400 }
      );
    }

    const todo: Omit<Todo, "_id" | "id"> = {
      title: title.trim(),
      description: description ? description.trim() : "",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("todos").insertOne(todo);

    const newTodo: Todo = {
      ...todo,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: [newTodo],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
