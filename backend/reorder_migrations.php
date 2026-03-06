<?php
$dir = __DIR__ . '/database/migrations';
$files = glob($dir . '/*.php');

$graph = [];
$tableToFile = [];

class MigrationFile {
    public $file;
    public $basename;
    public $tableCreated = null;
    public $dependencies = [];

    public function __construct($file) {
        $this->file = $file;
        $this->basename = basename($file);
        $this->parse();
    }

    public function parse() {
        $content = file_get_contents($this->file);
        
        // Find created table
        if (preg_match('/Schema::create\(\s*[\'"]([^\'"]+)[\'"]/', $content, $matches)) {
            $this->tableCreated = $matches[1];
        }
        
        // Find dependencies
        preg_match_all('/constrained\(\s*[\'"]([^\'"]+)[\'"]/', $content, $matches);
        if (!empty($matches[1])) {
            $this->dependencies = array_unique($matches[1]);
        }
    }
}

$migrations = [];
foreach ($files as $file) {
    if (strpos($file, 'users_table') !== false) {
        // base table
    }
    $m = new MigrationFile($file);
    if ($m->tableCreated) {
        $tableToFile[$m->tableCreated] = $m;
    }
    $migrations[] = $m;
}

// Build topological sort
$sorted = [];
$visited = [];
$tempMark = [];

function visit($name, &$sorted, &$visited, &$tempMark, $tableToFile, $migrationsArr) {
    if (isset($visited[$name])) return;
    if (isset($tempMark[$name])) {
        // Cyclic dependency, ignoring for now
        return;
    }
    $tempMark[$name] = true;

    if (isset($tableToFile[$name])) {
        $m = $tableToFile[$name];
        foreach ($m->dependencies as $dep) {
            visit($dep, $sorted, $visited, $tempMark, $tableToFile, $migrationsArr);
        }
        $sorted[] = $m;
        $visited[$name] = true;
    }
}

foreach ($migrations as $m) {
    if ($m->tableCreated) {
        visit($m->tableCreated, $sorted, $visited, $tempMark, $tableToFile, $migrations);
    } else {
        // If it doesn't create a table, add it first or last?
        $sorted[] = $m;
        $visited[$m->basename] = true;
    }
}

// Ensure non-table migrations are included
foreach ($migrations as $m) {
    if (!$m->tableCreated && !in_array($m, $sorted, true)) {
        array_unshift($sorted, $m);
    }
    if ($m->tableCreated && !isset($visited[$m->tableCreated])) {
        $sorted[] = $m;
    }
}

// Rename files
$prefix = 100000;
foreach ($sorted as $m) {
    $parts = explode('_', $m->basename, 5);
    if (count($parts) >= 5 && is_numeric($parts[0]) && is_numeric($parts[1])) {
        $namePart = preg_replace('/^\d{4}_\d{2}_\d{2}_\d{6}_/', '', $m->basename);
    } else {
        $namePart = $m->basename;
    }
    
    // Some are already 0001_01_01...
    if (strpos($m->basename, 'users_table') !== false) { $namePart = 'create_users_table.php'; }
    if (strpos($m->basename, 'cache_table') !== false) { $namePart = 'create_cache_table.php'; }
    if (strpos($m->basename, 'jobs_table') !== false) { $namePart = 'create_jobs_table.php'; }

    $newName = "2026_03_05_" . $prefix . "_" . $namePart;
    $prefix++;
    
    echo "Renaming " . $m->basename . " to " . $newName . "\n";
    rename($m->file, $dir . '/' . $newName);
}
echo "Done!\n";
