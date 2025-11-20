import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  Todo,
  UpdateTodoInput,
  TodoApiResponse,
  ApiResponse,
} from "@/types/todo";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<TodoApiResponse>> {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-todo");

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid todo ID",
        },
        { status: 400 }
      );
    }

    const todo = await db.collection<Todo>("todos").findOne({ _id: id });

    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    const serializedTodo: Todo = {
      ...todo,
      _id: todo._id.toString(),
      id: todo._id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: serializedTodo,
    });
  } catch (error) {
    console.error("GET /api/todos/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-todo");

    const { id } = await params;
    const body: UpdateTodoInput = await request.json();
    const { title, description, completed } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid todo ID",
        },
        { status: 400 }
      );
    }

    const updateData: Partial<Todo> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (completed !== undefined) updateData.completed = completed;

    const result = await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/todos/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-todo");

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid todo ID",
        },
        { status: 400 }
      );
    }

    const result = await db
      .collection("todos")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/todos/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
