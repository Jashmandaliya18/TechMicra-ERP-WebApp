const fs = require('fs');
const path = require('path');

const basePath = 'c:/Users/manav/Hackamined2/backend';

const models = [
    'AssetMaster',
    'AssetAddition',
    'AssetAllocation',
    'AssetSale',
    'AssetDepreciation'
];

const today = new Date();
const prefix = `${today.getFullYear()}_${String(today.getMonth() + 1).padStart(2, '0')}_${String(today.getDate()).padStart(2, '0')}_${String(today.getHours()).padStart(2, '0')}${String(today.getMinutes()).padStart(2, '0')}`;

models.forEach((model, index) => {
    // Controller
    const controllerPath = path.join(basePath, `app/Http/Controllers/${model}Controller.php`);
    fs.writeFileSync(controllerPath, `<?php\n\nnamespace App\\Http\\Controllers;\n\nuse Illuminate\\Http\\Request;\nuse App\\Models\\${model};\n\nclass ${model}Controller extends Controller\n{\n    public function index()\n    {\n        return ${model}::all();\n    }\n\n    public function store(Request $request)\n    {\n        $validated = $request->validate([\n            // add validation rules later\n        ]);\n\n        return ${model}::create($request->all());\n    }\n\n    public function show(string $id)\n    {\n        return ${model}::findOrFail($id);\n    }\n\n    public function update(Request $request, string $id)\n    {\n        $item = ${model}::findOrFail($id);\n        $item->update($request->all());\n        return $item;\n    }\n\n    public function destroy(string $id)\n    {\n        $item = ${model}::findOrFail($id);\n        $item->delete();\n        return response()->json(['message' => 'Deleted successfully']);\n    }\n}\n`);

    // Model
    const modelPath = path.join(basePath, `app/Models/${model}.php`);
    fs.writeFileSync(modelPath, `<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass ${model} extends Model\n{\n    use HasFactory;\n    protected $guarded = [];\n}\n`);

    // Migration
    const tableName = model.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1) + 's';
    // Format timestamp nicely to ensure unique order
    const migrationName = `${prefix}${String(index).padStart(2, '0')}_create_${tableName}_table.php`;
    const migrationPath = path.join(basePath, `database/migrations/${migrationName}`);

    fs.writeFileSync(migrationPath, `<?php\n\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nreturn new class extends Migration\n{\n    public function up(): void\n    {\n        Schema::create('${tableName}', function (Blueprint $table) {\n            $table->id();\n            $table->timestamps();\n        });\n    }\n\n    public function down(): void\n    {\n        Schema::dropIfExists('${tableName}');\n    }\n};\n`);
});

console.log('Successfully generated 5 Models, 5 Controllers, and 5 Migrations');
