<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'password',
    ];

    protected static function booted()
    {
        static::created(function ($user)
        {
            $defaultCategories = [
                ['name' => 'Housing', 'user_id' => $user->id],
                ['name' => 'Food', 'user_id' => $user->id],
                ['name' => 'Transportation', 'user_id' => $user->id],
                ['name' => 'Health', 'user_id' => $user->id],
                ['name' => 'Entertainment', 'user_id' => $user->id],
            ];

            foreach ($defaultCategories as $category)
            {
                \App\Models\Category::create($category);
            }
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function incomes()
    {
        return $this->hasMany(Income::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
